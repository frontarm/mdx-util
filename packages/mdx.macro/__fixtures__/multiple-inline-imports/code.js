import { mdx } from '../../mdx.macro'

const DocumentA = mdx`
import { test } from './test.js'

## This is some MDX source

<SomeComponent test={test} />
`

const DocumentB = mdx`
import { test } from './test.js'

## This is some MDX source

<SomeComponent test={test} />
`