import { ProjectConfigRepository } from 'core/repositories/ProjectConfigRepository';
import { MongoDbClient } from '../db/MongoDbClient';
import type { Role } from 'discord.js';
import type { WithId } from 'mongodb';
import type { ProjectConfig } from 'core/models/ProjectConfigModel';

class ProjectConfigService {
  private repository: ProjectConfigRepository;

  constructor(repository: ProjectConfigRepository) {
    this.repository = repository;
  }

  async getProjectConfig(
    gitlabProjectId: string
  ): Promise<WithId<ProjectConfig>> {
    return this.repository.getProjectConfig(gitlabProjectId);
  }

  async upsertProjectConfig(
    gitlabProjectId: string,
    forumIdToPostMrInfo: string
  ): Promise<void> {
    await this.repository.upsertProjectConfig(
      gitlabProjectId,
      forumIdToPostMrInfo
    );
  }

  async deleteProjectConfig(gitlabProjectId: string): Promise<void> {
    await this.repository.deleteProjectConfig(gitlabProjectId);
  }

  async addRoleToConfig(
    gitlabProjectId: string,
    role: Role['id'],
    specificyOfRole?: string | null
  ): Promise<void> {
    await this.repository.addRoleToConfig(
      gitlabProjectId,
      role,
      specificyOfRole
    );
  }
  async removeRolesFromConfig(
    gitlabProjectId: string,
    role: Role['id'],
    specificyOfRole?: string | null
  ): Promise<void> {
    await this.repository.removeRoleFromConfig(
      gitlabProjectId,
      role,
      specificyOfRole
    );
  }
}

const client = await MongoDbClient.getInstance();
const projectConfigRepository = new ProjectConfigRepository(client);

export const projectConfigService = new ProjectConfigService(
  projectConfigRepository
);
