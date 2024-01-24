import type { ObjectId } from 'mongodb';

export interface ProjectConfig {
  _id: ObjectId;
  forumIdToPostMrInfo: string;
  gitlabProjectId?: string;
  rolesToTag?: {
    all?: string[];
  } & Record<string, string[] | undefined>;
}
