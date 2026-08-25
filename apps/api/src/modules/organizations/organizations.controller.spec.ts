import { Test, TestingModule } from "@nestjs/testing";
import { OrganizationsController } from "./organizations.controller";
import { OrganizationsService } from "./organizations.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";

describe("OrganizationsController", () => {
  let controller: OrganizationsController;

  const mockOrgService = {
    getMyOrganizations: jest.fn().mockResolvedValue([
      { id: "org-1", name: "My Org", slug: "my-org", ownerId: "user-1" },
    ]),
    getOrganizationById: jest.fn().mockResolvedValue({
      id: "org-1",
      name: "My Org",
      slug: "my-org",
      ownerId: "user-1",
    }),
    updateOrganization: jest.fn().mockResolvedValue({
      id: "org-1",
      name: "Updated Org",
      slug: "my-org",
      ownerId: "user-1",
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationsController],
      providers: [{ provide: OrganizationsService, useValue: mockOrgService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<OrganizationsController>(OrganizationsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("GET /organizations/my should return user's organizations", async () => {
    const result = await controller.getMyOrganizations({
      sub: "user-1",
      email: "test@example.com",
      role: "user",
    });
    expect(result).toHaveLength(1);
    expect(mockOrgService.getMyOrganizations).toHaveBeenCalledWith("user-1");
  });

  it("GET /organizations/:id should return single organization", async () => {
    const result = await controller.getOrganization("org-1", {
      sub: "user-1",
      email: "test@example.com",
      role: "user",
    });
    expect(result).toHaveProperty("id", "org-1");
  });

  it("PATCH /organizations/:id should update organization", async () => {
    const result = await controller.updateOrganization(
      "org-1",
      { name: "Updated Org" },
      { sub: "user-1", email: "test@example.com", role: "user" },
    );
    expect(result.name).toBe("Updated Org");
  });
});
