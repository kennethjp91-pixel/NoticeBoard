import Link from "next/link";

export function Footer() {
    return (
        <footer className="py-12 bg-paper border-t border-ink/5">
            <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="font-marker text-xl font-bold">Human Notice Board</span>
                    <span className="text-xs text-ink/40">© {new Date().getFullYear()}</span>
                </div>
                <div className="flex gap-6 text-sm text-ink/60">
                    <Link href="#" className="hover:text-ink">Privacy</Link>
                    <Link href="#" className="hover:text-ink">Terms</Link>
                    <Link href="#" className="hover:text-ink">Contact</Link>
                </div>
            </div>
        </footer>
    );
}
