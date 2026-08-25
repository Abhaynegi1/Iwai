import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import {
  organizationMembers,
  organizations,
} from "@iwai/database";
import type { Database, Organization } from "@iwai/database";
import type { OrganizationEntity } from "@iwai/shared";
import { DRIZZLE_DB } from "../../database/database.module";

@Injectable()
export class OrganizationsService {
  constructor(@Inject(DRIZZLE_DB) private db: Database) {}

  async getMyOrganizations(userId: string): Promise<OrganizationEntity[]> {
    const memberships = await this.db.query.organizationMembers.findMany({
      where: eq(organizationMembers.userId, userId),
      with: {
        organization: true,
      },
    });

    return memberships.map((m: { organization: Organization }) =>
      this.toEntity(m.organization),
    );
  }

  async getOrganizationById(
    orgId: string,
    userId: string,
  ): Promise<OrganizationEntity> {
    const membership = await this.db.query.organizationMembers.findFirst({
      where: and(
        eq(organizationMembers.organizationId, orgId),
        eq(organizationMembers.userId, userId),
      ),
      with: {
        organization: true,
      },
    });

    if (!membership) {
      throw new NotFoundException("Organization not found or access denied");
    }

    return this.toEntity(membership.organization);
  }

  async updateOrganization(
    orgId: string,
    userId: string,
    data: { name?: string; avatarUrl?: string | null },
  ): Promise<OrganizationEntity> {
    const membership = await this.db.query.organizationMembers.findFirst({
      where: and(
        eq(organizationMembers.organizationId, orgId),
        eq(organizationMembers.userId, userId),
      ),
    });

    if (!membership || !["owner", "admin"].includes(membership.role)) {
      throw new ForbiddenException(
        "Only organization owners or admins can modify settings",
      );
    }

    const [updated] = await this.db
      .update(organizations)
      .set({
        ...(data.name ? { name: data.name } : {}),
        ...(data.avatarUrl !== undefined ? { avatarUrl: data.avatarUrl } : {}),
        updatedAt: new Date(),
      })
      .where(eq(organizations.id, orgId))
      .returning();

    return this.toEntity(updated);
  }

  private toEntity(org: Organization): OrganizationEntity {
    return {
      id: org.id,
      name: org.name,
      slug: org.slug,
      ownerId: org.ownerId,
      createdAt: org.createdAt.toISOString(),
      updatedAt: org.updatedAt.toISOString(),
    };
  }
}
