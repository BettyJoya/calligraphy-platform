import { useParams } from 'react-router-dom';

const Test = () => {
  const { key } = useParams();
  return (
    <div>
      {key}
      <A />
    </div>
  );
};

const A = () => {
  const { key } = useParams();

  return <div>AAA{key}</div>;
};

export { Test };
