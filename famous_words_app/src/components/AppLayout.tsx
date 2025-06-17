import { ReactNode } from 'react';
import { AppShell, Text, Group, Button } from '@mantine/core';
import Link from 'next/link';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <AppShell
      padding="md"
      header={
        <AppShell.Header h={60} p="xs">
          <Group justify="space-between">
            <Text fw={700} size="lg" component={Link} href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              偉人の名言集
            </Text>
            <Group>
              <Button component={Link} href="/quotes" variant="subtle" size="sm">
                すべての名言
              </Button>
              <Button component={Link} href="/words/humanity" variant="subtle" size="sm">
                人間性
              </Button>
              <Button component={Link} href="/words/science" variant="subtle" size="sm">
                科学
              </Button>
            </Group>
          </Group>
        </AppShell.Header>
      }
      footer={
        <AppShell.Footer h={60} p="md">
          <Text ta="center" size="sm">© 2025 偉人の名言集</Text>
        </AppShell.Footer>
      }
    >
      {children}
    </AppShell>
  );
}