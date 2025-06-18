'use client';

import { useState, useEffect } from 'react';
import { getWords, Words } from '../api/words';
import { Title, Text, Card, Grid, Loader, Alert, Select, Flex, Stack } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

export default function WordsPage() {
  const [category, setCategory] = useState<string>("all")
  const [imgUrl, setImageUrl] = useState<string>("url('/images/all_picture.jpg')")
  const [words, setWords] = useState<Words[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 初期表示 & セレクトボックスの値変更時
  useEffect(() => {
    fetchWords(category);
  }, [category]);


  // 名言取得API
  async function fetchWords(category: string) {
    try {
      const data: Words[] = await getWords(category);
      if (category != "all"){
        const newWords = data.filter((word) => word.category === category);
        setImageUrl("url('/images/"+category+"_picture.jpg')")
        setWords(newWords);
        setLoading(false);
      }else{
        setImageUrl("url('/images/"+category+"_picture.jpg')")
        setWords(data);
        setLoading(false);
      }
    } catch (err) {
      setError(`台詞の取得に失敗しました。`);
      setLoading(false);
    }
  }


  return (
      <Flex
      justify="center"
      style={{
              backgroundImage: imgUrl,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundAttachment: "fixed",
        }}>
        <Stack justify='center' align="center" h="100vh" w="85vw" p="md" py="xl">
          <Title order={1}>台詞検索</Title>
          <Select 
            label="カテゴリー"
            placeholder="all" 
            size="md" 
            mb="md"
            opacity={0.6}
            data={[
              {value: "all", label: "全て"},
              {value: "love", label: "恋愛"},
              {value: "freedom", label: "自由"},
              {value: "life", label: "人生"},
              {value: "future", label: "未来"},
            ]}
            onChange={(value) => value? setCategory(value): undefined}
          />
            {loading ? (
                <div style={{ height: "65vh", display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                  <Loader size="xl" />
                </div>
              ) : error ? (
                <Alert icon={<IconAlertCircle size="1rem" />} title="エラー" color="red">
                  {error}
                </Alert>
              ) : (
                <Grid 
                h="65vh"
                style={{    
                  position: 'relative',
                  overflowY: 'auto',
                  scrollbarWidth: 'none',        // Firefox用
                  msOverflowStyle: 'none',       // Internet Explorer用
                }}
                className="hide-scroll"
                >
                  {words.map((word) => (
                    <Grid.Col key={word.id} span={{ base: 12, sm: 8, md: 6 }} opacity={0.6}>
                      <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Text fw={500} size="lg" mb="xs">「{word.quote}」</Text>
                        <Text c="dimmed" ta="right">- {word.source}</Text>
                      </Card>
                    </Grid.Col>
                  ))}
                </Grid>
              )
            }
        </Stack>
      </Flex>
  );
}