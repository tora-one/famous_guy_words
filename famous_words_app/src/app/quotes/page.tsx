'use client';

import { useState, useEffect } from 'react';
import { getQuotes, Quote } from '../api/quotes';
import { Container, Title, Text, Card, Grid, Loader, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { AppLayout } from '../../components/AppLayout';

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuotes() {
      try {
        const data = await getQuotes();
        setQuotes(data);
        setLoading(false);
      } catch (err) {
        setError('名言の取得に失敗しました。');
        setLoading(false);
      }
    }

    fetchQuotes();
  }, []);

  return (
    <AppLayout>
      <Container size="lg" py="xl">
        <Title order={1} mb="xl">偉人の名言集</Title>
        
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
            {quotes.map((quote) => (
              <Grid.Col key={quote.id} span={{ base: 12, sm: 6, md: 4 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Text fw={500} size="lg" mb="xs">「{quote.quote}」</Text>
                  <Text c="dimmed" ta="right">- {quote.author}</Text>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Container>
    </AppLayout>
  );
}