type TransparencyCardProps = {
  title: string;
  description: string | JSX.Element;
};

export default function TransparencyCard({ title, description }: TransparencyCardProps) {
  return (
    <article className='h-full max-w-80 rounded-[20px] bg-white px-5 pt-6 pb-6 md:px-8 md:pt-10 md:pb-8 shadow-sm'>
      <h3 className='text-[22px] md:text-[24px] leading-tight font-semibold text-[#0F1116]'>{title}</h3>
      <div className='mt-4 md:mt-6 whitespace-pre-line text-[18px] tracking-wide leading-[1.6] text-[#5B657B]'>{description}</div>
    </article>
  );
}
