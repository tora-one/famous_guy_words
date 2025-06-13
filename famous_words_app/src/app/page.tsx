import Link from "next/link";
import { Container, Title, Text, Button, Group, Stack } from '@mantine/core';
import { AppLayout } from '../components/AppLayout';

export default function Home() {
  return (
    <AppLayout>
      <Container size="md" py="xl">
        <Stack align="center" gap="xl">
          <div>
            <Title ta="center" order={1} mb="sm">偉人の名言集</Title>
            <Text ta="center" size="xl" mb="lg">歴史上の偉人たちの心に響く言葉</Text>
          </div>

          <Group justify="center">
            <Button component={Link} href="/quotes" variant="filled" size="md">
              すべての名言
            </Button>
            <Button component={Link} href="/words/humanity" variant="outline" size="md">
              人間性に関する名言
            </Button>
          </Group>
        </Stack>
      </Container>
    </AppLayout>
  );
}