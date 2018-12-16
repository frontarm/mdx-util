import textr from 'textr';
import apostrophes from 'typographic-apostrophes';
import quotes from 'typographic-quotes';
import apostrophesForPlurals from 'typographic-apostrophes-for-possessive-plurals';
import ellipses from 'typographic-ellipses';
import emDashes from 'typographic-em-dashes';
import enDashes from 'typographic-en-dashes';

export default textr()
  .use(
    apostrophes,
    quotes,
    apostrophesForPlurals,
    ellipses,
    emDashes,
    enDashes
  );
