'use client';

import { useState, useEffect } from 'react';
import { getWords, Words } from '../../api/words';
import { Container, Title, Text, Card, Grid, Loader, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useParams } from 'next/navigation';
import { AppLayout } from '../../../components/AppLayout';

export default function WordsPage() {
  const params = useParams();
  const type = params.type as string;
  
  const [words, setWords] = useState<Words[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWords() {
      try {
        const data = await getWords(type);
        setWords(data);
        setLoading(false);
      } catch (err) {
        setError(`名言の取得に失敗しました。`);
        setLoading(false);
      }
    }

    fetchWords();
  }, [type]);

  return (
    <AppLayout>
      <Container size="lg" py="xl">
        <Title order={1} mb="xl">{type}に関する名言集</Title>
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <Loader size="xl" />
          </div>
        ) : error ? (
          <Alert icon={<IconAlertCircle size="1rem" />} title="エラー" color="red">
            {error}
          </Alert>
        ) : (
          <Grid>
            {words.map((word) => (
              <Grid.Col key={word.id} span={{ base: 12, sm: 6, md: 4 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Text fw={500} size="lg" mb="xs">「{word.quote}」</Text>
                  <Text c="dimmed" ta="right">- {word.author}</Text>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Container>
    </AppLayout>
  );
}