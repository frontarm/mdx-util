import { MDXTag } from '@mdx-js/tag';
import { test as _test } from './test.js';

const Document = ({
  components,
  ...props
}) => <MDXTag name="wrapper" components={components}>
  <MDXTag name="h1" components={components}>{`Don't Panic`}</MDXTag>
  <MDXTag name="p" components={components}><MDXTag name="em" components={components} parentName="p">{`Since we decided a few weeks ago to adopt the leaf as legal tender, we have, of course, all become immensely rich.`}</MDXTag></MDXTag>
  <SomeComponent test={_test} /></MDXTag>;