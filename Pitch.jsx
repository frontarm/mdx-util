import { createFactory } from 'react'
import Link from './Link'
import ButtonTheme from './ButtonTheme'
import ExampleSet from './ExampleSet'
import ComponentExample from './ComponentExample'
import GistVanillaExample from './examples/the-gist-vanilla'
import GistSugarFreeExample from './examples/the-gist-sugar-free'
import BasicExample from './examples/basic'

export default function({ factories={}, test }) {
  const {
    wrapper = createFactory('div'),
    p = createFactory('p'),
    h2 = createFactory('h2'),
    codeBlock = (props) => <pre {...props}><code>{props.children}</code></pre>,
    code = createFactory('code'),
    strong = createFactory('strong'),
    blockquote = createFactory('blockquote'),
    ul = createFactory('ul'),
    li = createFactory('li'),
    a = createFactory('a'),
    h3 = createFactory('h3'),
    img = createFactory('img'),
  } = elements

  return (
    wrapper({}, 
      p({},
        "Add routes to your reusable components",
      ),
      <Link theme={<ButtonTheme />}>15 Minute Course</Link>,
      <Link theme={<ButtonTheme />}>Documentation</Link>,
      h2({"id": "the-gist"},
        "The Gist",
      ),
      <Tab.Group theme={<TabbedExamples />}>
        <Tab.Item title='Vanilla React'>
            <ComponentExample example={GistVanillaExample} />
        </Tab.Item>
        <Tab.Item title='Sugar Free'>
            <ComponentExample example={GistSugarFreeExample} />
        </Tab.Item>
      </Tab.Group>,
      h2({"id": "try-for-yourself"},
        "Try For Yourself",
      ),
      p({},
        "Create a new React app:",
      ),
      codeBlock({"className": "language-bash"}, "<span class=\"token function\">npm</span> <span class=\"token function\">install</span> -g create-react-app\ncreate-react-app junctions-example\n<span class=\"token function\">cd</span> junctions-example\n"),
      p({},
        "Install junctions:",
      ),
      codeBlock({"className": "language-bash"}, "<span class=\"token function\">npm</span> <span class=\"token function\">install</span> --save junctions react-junctions <span class=\"token function\">history</span>\n"),
      p({},
        "Then copy and paste any example from this page into your ",
        code({}, "src/App.js"),
        " file! For example, this one:",
      ),
      <ComponentExample example={BasicExample} />,
      h2({"id": "what-about-react-router-4"},
        "What about react-router 4?",
      ),
      p({},
        "The main difference between junctions.js and react-router is this: ",
        strong({},
          "junctions puts components first, react-router puts URLs first",
        ),
        ".",
      ),
      p({},
        "This means that if you’re building an application, junctions will probably solve your problem better. And while some people are still building websites, most people are building applications.",
      ),
      blockquote({},
        p({},
          "Do not divide the web into documents and applications. Documents are dead.",
        ),
      ),
      ul({},
        li({},
          a({"href": "https://twitter.com/thejameskyle/status/824790686822129665"},
            "@thejameskyle",
          ),
        ),
      ),
      p({},
        "But let’s look at some specifics.",
      ),
      h3({"id": "junctions-makes-routing-information-more-accessible"},
        "Junctions makes routing information more accessible",
      ),
      ul({},
        li({},
          "In ",
          strong({},
            "junctions.js",
          ),
          ", your routes are defined in a ",
          code({}, "createJunction()"),
          " statement, and accessible through your component’s ",
          code({}, "junctions"),
          " property.",
        ),
        li({},
          "In ",
          strong({},
            "react-router 4",
          ),
          ", your routes are defined within your component’s ",
          code({}, "render()"),
          " method using ",
          code({}, "<Route>"),
          " elements, and hidden from the outside world.",
        ),
      ),
      p({},
        "Junctions is a little bit more verbose, but it gives you a lot more flexibility. You can use the ",
        code({}, "Junction"),
        " object that it provides to generate things like menus or a list of all possible routes:",
      ),
      <Tab.Group theme={<TabbedExamples />}>
        <Tab.Item title='Menu'>
          <ComponentExample example={MenuExample} />
        </Tab.Item>
        <Tab.Item title='Route Map'>
          <ComponentExample example={RouteMapExample} />
        </Tab.Item>
      </Tab.Group>,
      h3({"id": "junctions-warns-you-when-a-linked-path-does-not-exist"},
        "Junctions warns you when a linked path does not exist",
      ),
      p({},
        "Because routing information is accessible to the outside world, the junctions.js ",
        code({}, "<Link>"),
        " element will warn you when you’ve made a typo or referred to a non-existent route.",
      ),
      h3({"id": "junctions-lets-you-mount-components-under-html5-history-state"},
        "Junctions lets you mount components under HTML5 History state",
      ),
      p({},
        "TODO",
      ),
      h3({"id": "junctions-gives-you-hostname-based-routing-out-of-the-box"},
        "Junctions gives you hostname-based routing out of the box",
      ),
      p({},
        "TODO",
      ),
      h3({"id": "junctions-lets-you-go-sugar-free"},
        "Junctions lets you go sugar-free",
      ),
      p({},
        img({"src": require("./what-you-get-from-junctions/routes-vs-components.png"), "alt": "Routes and Components"}),
      )
    )
  )
}

