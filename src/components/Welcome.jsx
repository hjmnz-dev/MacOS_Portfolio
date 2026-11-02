import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import useLanguageStore, { useTranslation } from "#store/language"

const FONT_WEIGHTS = {
    subtitle: {min: 100, max:400, default:100},
    title: {min: 400, max:900, default:400},
}

const renderText = (text, className, baseWeight = 400) => {
    return [...text].map((char, i) => (
        <span key={i} className={className} style={{
            fontVariationSettings: `'wght' ${baseWeight}`
        }}>
            {char === " " ? "\u00A0" : char}
        </span>
    ))
}

const setupTextHover = (container, type) => {
    if(!container) return;

    const letters = container.querySelectorAll('span');
    const {min,max,default: base }=FONT_WEIGHTS[type];

    const animateLetter = (letter,weight,duration=0.25) => {
        return gsap.to(letter, {duration, ease: 'power2.out', overwrite: 'auto',
            fontVariationSettings: `'wght' ${weight}`,
        })
    }

    const handleMouseMove = (e) => {
        const {left}= container.getBoundingClientRect();
        const mouseX = e.clientX - left;

        letters.forEach((letter) => {
            const {left: l, width:w } = letter.getBoundingClientRect();
            const distance = Math.abs(mouseX - (l - left + w / 2));
            const intensity = Math.exp(-(distance ** 2) / 20000);

            animateLetter(letter, min + (max-min) * intensity)
        })
    }

    const handleMouseLeave = () => letters.forEach((letter)=>
    animateLetter(letter,base,0.3))

    container.addEventListener("mousemove",handleMouseMove);
    container.addEventListener("mouseleave",handleMouseLeave);

    return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
    }
}

const Welcome = () => {
    const { language } = useLanguageStore();
    const t = useTranslation();
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);

    useGSAP(()=>{
        const titleCleanup = setupTextHover(titleRef.current, 'title');
        const subtitleCleanUp = setupTextHover(subtitleRef.current, 'subtitle');

        return ()=> {
            subtitleCleanUp();
            titleCleanup();
        }
    },[language])
    return <section id="welcome">
        <p key={`subtitle-${language}`} ref={subtitleRef}> {renderText(t("Hey, I'm Hamsell! Welcome to my"), "max-sm:text-2xl text-3xl font-georama", 100)}</p>
        <h1 key={`title-${language}`} ref={titleRef} className="mt-7">
            {renderText(t("Portfolio"),"max-sm:text-7xl text-9xl italic font-georama")}
        </h1>
    </section>

}

export default Welcome