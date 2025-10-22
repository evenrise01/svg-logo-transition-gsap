import Link from "next/link";


export const Nav = () => {
    return(
        <nav className="fixed w-screen p-8 flex justify-between items-center z-1">
            <div className="nav-logo">
                <Link href="/">Silhoutte</Link>
            </div>
            <div className="flex gap-8">
            <Link href="/">Index</Link>
            <Link href="/archive">Archive</Link>
            <Link href="/contact">Contact</Link>
            </div>
        </nav>
    )
}