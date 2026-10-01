import Image from "next/image";

export function PartnerCell({ p }: { p: { name: string; slug: string } }) {


  return (
    <div className="group flex md:h-[160px] items-center justify-center rounded-[10px] border border-gray-100 bg-white p-4 text-center transition-all duration-300">
      <div className="relative flex h-28 w-full items-center justify-center">
        <Image
          src={`/homepage-new/partners/${p.slug}.svg`}
          alt={p.name}
          width={240}
          height={124}
          className="absolute h-10 max-w-[88%] w-auto object-contain transition-all duration-300 group-hover:opacity-0"
        //   onError={() => setFailed(true)}
        />
        <Image
          src={`/homepage-new/partners/orignal/${p.slug}.svg`}
          alt={`${p.name} original`}
          width={240}
          height={124}
          className="absolute h-11 max-w-[88%] w-auto object-contain opacity-0 transition-all duration-300 group-hover:opacity-100"
        //   onError={() => setFailed(true)}
        />
      </div>
    </div>
  );
}