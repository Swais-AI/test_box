import { notFound } from 'next/navigation';
import { pageContent } from '../../../data/pageContent';

export function generateStaticParams() {
  return Object.keys(pageContent).map(slug => ({ slug }));
}

export default async function GenericPage({ params }) {
  const { slug } = await params;
  const content = pageContent[slug];

  if (!content) {
    notFound();
  }

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full animate-fadeIn">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{content.title}</h1>
        <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full"></div>
      </div>
      
      {content.introText && (
        <div className="mb-16 max-w-4xl mx-auto glass-card p-8 text-center md:text-left text-lg text-slate-300 leading-relaxed border-l-4 border-l-cyan-500">
          {content.introText.split(/<br\s*\/?>/gi).filter(Boolean).map((paragraph, i) => (
            <p key={i} className={i > 0 ? 'mt-4' : ''}>{paragraph}</p>
          ))}
        </div>
      )}
      
      {content.subtitle && (
        <h2 className="text-3xl font-bold text-white mb-8 text-center">{content.subtitle}</h2>
      )}
      
      <div className={`grid grid-cols-1 md:grid-cols-2 ${content.isBlog ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-6`}>
        {content.sections.map(sec => (
          <div key={sec.id} className="glass-card p-8 rounded-2xl hover:-translate-y-1 transition-all duration-300 group cursor-default flex flex-col h-full">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/10 flex items-center justify-center mb-6 group-hover:from-cyan-500/30 group-hover:to-purple-500/30 transition-all">
              <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {content.isBlog ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15M9 11l3 3m0 0l3-3m-3 3V8" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                )}
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-cyan-400 transition-colors">{sec.title}</h3>
            <p className="text-slate-400 text-base leading-relaxed flex-grow">{sec.desc}</p>
            {content.isBlog && (
              <div className="mt-6 pt-4 border-t border-white/5 text-sm font-semibold text-cyan-400 cursor-pointer hover:text-cyan-300 transition-colors">
                Read Article &rarr;
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
