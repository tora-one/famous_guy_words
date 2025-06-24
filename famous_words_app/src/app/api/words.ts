// APIクライアント関数 - Words

export interface Words {
  id: number;
  source: string;
  writer: string;
  quote: string;
  category: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
console.log("★★")
export async function getWords(category: string): Promise<Words[]> {
  try {
    console.log(`Fetching words from: ${API_URL}/api/words?category=${encodeURIComponent(category)}`);
    const response = await fetch(`${API_URL}/api/words?category=${encodeURIComponent(category)}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error: ${response.status} - ${errorText}`);
      throw new Error(`Failed to fetch words of category ${category}: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching words:', error);
    throw error;
  }
}