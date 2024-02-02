import { config, type ProjectConfig } from 'config';

export const getProjectConfigByGitlabProjectId = (
  gitlabProjectId: number
): ProjectConfig => {
  const projectConfig: ProjectConfig | undefined =
    config[gitlabProjectId.toString()];

  if (!projectConfig) {
    throw new Error(
      `Project config for gitlab project id ${gitlabProjectId} not found`
    );
  }
  return projectConfig;
};
