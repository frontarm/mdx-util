export default ({ environment }) => ({

  /**
   * Specify the Webpack loaders that Sitepack will use. This follows the same
   * format as the `rules` option in Webpack 2's configuration file.
   * 
   * Read more at https://webpack.js.org/configuration/module/#module-rules
   */
  rules: [

    /**
     * Run any JavaScript other than `.page.js` files through babel to enable
     * ES6 and JSX support. Babel can be configured using the `.babelrc` file
     * in the project's root directory.
     */
    { test: /\.js$/,
      exclude: /node_modules|\.page\.js$/,
      loader: 'babel'
    },

    /**
     * The `sitepack-page` loader converts a plain-old JavaScript object
     * into the `Page` object that Sitepack uses internally. We also run
     * `.page.js` through babel, but do so separately from standard
     * `.js` files.
     */
    { test: /\.page\.js$/,
      exclude: /node_modules/,
      use: [
        'sitepack-page',
        'babel'
      ]
    },

    /**
     * MDX is a tool that converts Markdown files to React components. This 
     * loader uses MDX to create Page objects for Markdown files.
     */
    { test: /\.mdx?$/,
      use: [
        'babel',
        {
          loader: 'sitepack-mdx-page',
          options: {
            eager: true,
          },
        },
      ]
    },

    /**
     * Allows you to `require()` images. Images under 4kb will be inlined with
     * a data URL, while larger images will be given their own files.
     */
    { test: /\.(gif|jpe?g|png|ico)$/,
      loader: 'url',
      options: { limit: 4000 },
    },

    /**
     * The `sitepack-css` loader handles hot reloading of CSS during
     * development, and also extracts your CSS into a separate file in a
     * production build.
     */
    { test: /\.css$/,
      loader: 'sitepack-css',
    },

    /**
     * You can use CSS preprocessor like SASS, LESS or PostCSS by chaining
     * them with the `sitepack-css` loader.
     */
    { test: /\.less$/,
      use: [
        'sitepack-css',
        'less'
      ],
    },
  ],

  /**
   * This section is used to configure the paths to various files and
   * directories that Sitepack requires.
   */
  paths: {

    /**
     * The file containing a template for your generated HTML files.
     */
    html: './index.html.ejs',

    /**
     * The file that exports the function to be called once your app has loaded.
     */
    main: './main.js',

    /**
     * The directory whose contents will be copied into your build directory.
     */
    public: './public',

    /**
     * The directory where any custom loaders for this website are stored.
     */
    loaders: './loaders',

    /**
     * The file that exports the function that will be used to render a string
     * with the HTML content for each page.
     */
    renderToString: './renderToString.js',

    /**
     * The file that exports the function responsible for creating your Site
     * object, and loading the root Page.
     */
    site: './createSite.js',
  },

  /**
   * You can specify a list of node modules whose contents should be included
   * in a separate `vendor.js` bundle, instead of the main `entry.js` bundle.
   *
   * Separating vendor files into a separate bundle will reduce the size
   * of your application bundle, increasing loading speed when you change
   * your site's content.
   */
  vendor: [
    'react',
    'react-dom'
  ],
})
