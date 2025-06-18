import Link from "next/link";
import { Container, Title, Text, Button, Stack, Flex } from '@mantine/core';

export default function Home() {
  return (        
    <Flex
        h="100vh"
        justify="center"
        align="center"
        style={{
          backgroundImage: "url('/images/top_page_picture.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}>
      <Container size="md" py="xl">
        <Stack align="center"  gap="xl">
          <div>
            <Title ta="center" order={1} mb="sm" c="white">小説の台詞集</Title>
            <Text ta="center" size="xl" mb="lg" c="white">必要な言葉は、探していないときに限って目に入る。</Text>
          </div>
            <Button component={Link} href="/search" variant="gradient" gradient={{ from: 'rgba(194, 145, 145, 1)', to: 'rgba(54, 0, 0, 1)', deg: 90 }} size="md" styles={{label: {color: "white"}}} >
              台詞を見てみる
            </Button>
        </Stack>
      </Container>
    </Flex>
  );
}