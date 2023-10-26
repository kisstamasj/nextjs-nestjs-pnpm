import { execSync } from 'child_process';

global.beforeEach(async () => {
  try {
    const res = execSync(
      'cd ../../infra && docker compose -f docker-compose-test.yml down && docker compose -f docker-compose-test.yml up -d',
      {
        stdio: 'pipe',
      },
    );

    const waiting = new Promise((res) =>
      setTimeout(() => res('waiting'), 3000),
    );
    await Promise.all([waiting]);
  } catch (error) {
    console.log('Failed to start the test DB', error);
  }
});

global.afterAll(async () => {
  const res = execSync(
    'cd .. && docker compose -f docker-compose-test.yml down',
    {
      stdio: 'pipe',
    },
  );
});
