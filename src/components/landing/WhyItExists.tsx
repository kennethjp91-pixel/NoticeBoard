export function WhyItExists() {
    return (
        <section className="py-20 bg-ink text-paper">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold font-marker mb-6">
                            Why does this exist?
                        </h2>
                        <div className="space-y-6 text-lg text-paper/80 leading-relaxed">
                            <p>
                                Physical town bulletin boards have largely disappeared, replaced by noisy, global social media feeds.
                            </p>
                            <p>
                                Local Facebook groups and Line chats are often cluttered, aggressive, or require you to expose your full identity just to ask a simple question.
                            </p>
                            <p>
                                We believe people need a <span className="text-white font-semibold">low-friction, low-identity way</span> to express local needs, offer help, and share feelings without the pressure of "building a following."
                            </p>
                        </div>
                    </div>
                    <div className="relative h-64 md:h-96 bg-paper/5 rounded-lg p-8 flex items-center justify-center border border-paper/10">
                        <p className="font-marker text-2xl md:text-3xl text-center opacity-80 rotate-2">
                            "Quiet, local, human."
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
