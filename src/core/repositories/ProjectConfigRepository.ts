import { PROJECT_CONFIG_COLLECTION_NAME } from 'core/const';
import { MongoDbClient } from 'core/db/MongoDbClient';
import type { ProjectConfig } from 'core/models/ProjectConfigModel';
import type { Role } from 'discord.js';
import type { WithId } from 'mongodb';

export class ProjectConfigRepository {
  private dbClient: MongoDbClient;

  constructor(dbClient: MongoDbClient) {
    this.dbClient = dbClient;
  }

  async getProjectConfig(
    gitlabProjectId: string
  ): Promise<WithId<ProjectConfig>> {
    const db = this.dbClient.getDb();
    const result = await db
      .collection<ProjectConfig>(PROJECT_CONFIG_COLLECTION_NAME)
      .findOne({ gitlabProjectId });

    if (!result) {
      throw new Error(
        `Project config for gitlab id ${gitlabProjectId} not found`
      );
    }

    return result;
  }

  async upsertProjectConfig(
    gitlabProjectId: string,
    forumIdToPostMrInfo: string
  ): Promise<void> {
    const db = this.dbClient.getDb();
    await db
      .collection<ProjectConfig>(PROJECT_CONFIG_COLLECTION_NAME)
      .updateOne(
        { gitlabProjectId },
        { $set: { forumIdToPostMrInfo } },
        { upsert: true }
      );
  }

  async deleteProjectConfig(gitlabProjectId: string): Promise<void> {
    const db = this.dbClient.getDb();
    const deletionResult = await db
      .collection<ProjectConfig>(PROJECT_CONFIG_COLLECTION_NAME)
      .deleteOne({ gitlabProjectId });

    if (deletionResult.deletedCount === 0) {
      throw new Error(`No project with id ${gitlabProjectId} was found`);
    }
  }

  async addRoleToConfig(
    gitlabProjectId: string,
    role: Role['id'],
    specificityOfRole?: string | null
  ): Promise<void> {
    const rolesToTagPath = `rolesToTag.${specificityOfRole ?? 'all'}`;
    const db = this.dbClient.getDb();

    const result = await db
      .collection<ProjectConfig>(PROJECT_CONFIG_COLLECTION_NAME)
      .updateOne(
        { gitlabProjectId },
        {
          $addToSet: {
            [rolesToTagPath]: role,
          },
        }
      );

    if (result.matchedCount === 0) {
      throw new Error(
        `Project with gitlabProjectId "${gitlabProjectId}" not found`
      );
    }

    if (result.modifiedCount === 0) {
      throw new Error(
        `Project with gitlabProjectId "${gitlabProjectId}" was not updated`
      );
    }
  }

  async removeRoleFromConfig(
    gitlabProjectId: string,
    role: Role['id'],
    specificityOfRole?: string | null
  ): Promise<void> {
    const rolesToTagPath = `rolesToTag.${specificityOfRole ?? 'all'}`;
    const db = this.dbClient.getDb();

    const result = await db
      .collection<ProjectConfig>(PROJECT_CONFIG_COLLECTION_NAME)
      .updateOne(
        { gitlabProjectId },
        {
          $pull: {
            [rolesToTagPath]: role,
          },
        }
      );

    if (result.matchedCount === 0) {
      throw new Error(
        `Project with gitlabProjectId "${gitlabProjectId}" not found`
      );
    }

    if (result.modifiedCount === 0) {
      throw new Error(
        `Role "${role}" was not found in ProjectConfig for gitlabProjectId "${gitlabProjectId}" or other error`
      );
    }
  }
}
