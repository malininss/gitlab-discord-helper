export interface ProjectConfig {
  forumIdToPostMrInfo: string;
  gitlabGroupIdToDiscordRoleIdMap: Record<string, string>;
}

export type Config = Record<string, ProjectConfig>;
