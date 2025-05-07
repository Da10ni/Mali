import { useRouter } from 'next/router';

const LanguageSwitcher = () => {
  const router = useRouter();

  const changeLanguage = (lang: string) => {
    router.push(router.asPath, undefined, { locale: lang });
  };

  return (
    <div>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('ar')}>عربى</button>
    </div>
  );
};
  
export default LanguageSwitcher;
