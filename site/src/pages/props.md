prop value
prop onChange

<h1>Hello{value ? ', '+value : ''}!</h1>

<input
  placeholder='What is your name?'
  value={value}
  onChange={onChange}
/>

React components wouldn't be React components without props. So as you may suspect, MDX components can have props too!

Declaring props
---------------

To add a prop to an MDX component, declare it at the top of your file like so:

```
prop firstName
```

`prop` statements cannot have any leading whitespace, and must appear before any other content or empty lines. The only exception is that they *may* be intermixed with import statements. So this is ok:

```
import Welcomer from './components/Welcomer'
prop firstName
```

Prop definitions can be mixed with imports

Using props
-----------

Once you've declared a prop, you can use it within a tag's attributes, or within curly braces in a JSX block. Bare in mind that you *cannot* use a prop within curly braces in *inline* JSX.

So, this is OK:

```jsx
Hello, <span children={firstName} />
```

As is this:

```jsx
<blockquote>I'm afraid I can't do that, {firstName}.</blockquote>
```

But this will just print the braces as text:

```markdown
Hello <span>{firstName}</span>.
```
