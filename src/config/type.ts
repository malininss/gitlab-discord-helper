import projectsConfig from './projectsConfig.json' assert { type: 'json' };

export type ProjectConfig = (typeof projectsConfig)[keyof typeof projectsConfig];
export type ProjectConfigKeys = keyof typeof projectsConfig;
