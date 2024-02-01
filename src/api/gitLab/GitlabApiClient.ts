import { HttpClient } from '../HttpClient';

const BASE_GITLAB_URL = 'https://gitlab.com/api/v4/projects';

export class GitlabApiClient {
  private static instance: GitlabApiClient;
  private httpClient: HttpClient;

  private constructor() {
    this.httpClient = new HttpClient(BASE_GITLAB_URL, {
      'PRIVATE-TOKEN': process.env.GITLAB_ACCESS_TOKEN,
    });
  }

  private static getInstance(): GitlabApiClient {
    if (!GitlabApiClient.instance) {
      GitlabApiClient.instance = new GitlabApiClient();
    }

    return GitlabApiClient.instance;
  }

  static async makeRequest<T>(endpoint: string): Promise<T> {
    const client = GitlabApiClient.getInstance();

    return client.httpClient.request<T>(endpoint);
  }
}
