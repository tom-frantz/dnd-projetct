import * as Font from "expo-font";

// @ts-ignore
import Cardo from "../../assets/fonts/cardo/Cardo-Regular.ttf";
// @ts-ignore
import LibreFranklin from "../../assets/fonts/libre_franklin/LibreFranklin-Regular.ttf";
// @ts-ignore
import LibreBaskervilleRegular from "../../assets/fonts/libre_baskerville/LibreBaskerville-Regular.ttf";

// @ts-ignore
import QuattrocentoSansRegular from "../../assets/fonts/quattrocentro_sans/QuattrocentoSans-Regular.ttf";
// @ts-ignore
import QuattrocentoSansBold from "../../assets/fonts/quattrocentro_sans/QuattrocentoSans-Bold.ttf";
// @ts-ignore
import QuattrocentoSansItalic from "../../assets/fonts/quattrocentro_sans/QuattrocentoSans-Italic.ttf";
//@ts-ignore
import QuattrocentoSansBoldItalic from "../../assets/fonts/quattrocentro_sans/QuattrocentoSans-BoldItalic.ttf";

export const loadFonts = async () => {
    await Font.loadAsync({
        Cardo: Cardo,
        "Libre Franklin": LibreFranklin,
        "Libre Baskerville Regular": LibreBaskervilleRegular,
        "Quattrocento Sans Regular": QuattrocentoSansRegular,
        "Quattrocento Sans Bold": QuattrocentoSansBold,
        "Quattrocento Sans Italic": QuattrocentoSansItalic,
        "Quattrocento Sans Bold Italic": QuattrocentoSansBoldItalic,
    });
};
