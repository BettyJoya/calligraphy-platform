import { fetchData } from './fetchData.ts';

const addHistoryFetch = async (id: string) => {
  try {
    const res = await fetchData(
      'POST',
      {
        url: `http://localhost:3001/api/copybook/addHistory`,
        headers: {
          'Content-Type': 'application/json'
        }
      },
      {
        copybookId: id
      }
    );
    if (res.code !== 200) {
      throw new Error(res.data as string);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
};

export { addHistoryFetch };
