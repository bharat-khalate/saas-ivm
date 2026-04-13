import { useEffect } from "react";

export type PageTitleProps = {
    title: string;
    subTitle?: string;
};


export default function PageTitle({ title, subTitle }: PageTitleProps) {
    useEffect(() => {
        const fullTitle = subTitle ? `${title} | ${subTitle}` : title;
        document.title = fullTitle;
    }, [title, subTitle]);

   return <></>;
}