import { corePlatformContent } from "@/constants/core-platform";

export default function CorePlatformSection() {
  return (
    <section className="relative overflow-hidden bg-[#050816] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center sm:mb-14">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400">
            {corePlatformContent.badge}
          </p>

          <h2 className="mx-auto max-w-6xl text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl lg:leading-[0.95]">
            {corePlatformContent.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {corePlatformContent.features.map((feature) => (
            <div
              key={feature.id}
              className="group rounded-2xl border border-white/8 bg-white/3 p-5 backdrop-blur-[2px] transition duration-300 hover:border-cyan-400/30 hover:bg-white/5 sm:p-8"
            >
              <div className="mb-8 text-4xl">{feature.icon}</div>

              <p className="mb-3 text-sm font-semibold tracking-[0.2em] text-cyan-400">
                {feature.id}
              </p>

              <h3 className="mb-4 text-2xl font-semibold leading-tight text-white">
                {feature.title}
              </h3>

              <p className="max-w-md text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
