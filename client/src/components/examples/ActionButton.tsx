import ActionButton from '../ActionButton';

export default function ActionButtonExample() {
  return (
    <div className="flex gap-4 items-center justify-center p-8 bg-background">
      <ActionButton type="nope" onClick={() => console.log('Nope clicked')} />
      <ActionButton type="super" onClick={() => console.log('Super chispa clicked')} />
      <ActionButton type="like" onClick={() => console.log('Like clicked')} />
    </div>
  );
}
