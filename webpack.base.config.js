const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const glob = require('glob');
const WebpackBar = require('webpackbar');
const webpack = require('webpack');

const isProduction = () => process.env.NODE_ENV === 'production';

const paths = [
  path.resolve(__dirname, './front-assets'),
  path.resolve(__dirname, './src/**/webpack'),
];

const dist = {
  build: path.resolve(__dirname, './public/webpack'),

  scripts: '',
};

const pattern = {
  scripts: {
    pattern: '/**/js/**/entry.js',
    splitFolder: 'js',
    distFolder: 'js',
  },
  react: {
    pattern: '/**/react/**/entry.jsx',
    splitFolder: 'react',
    distFolder: 'react',
  },
  styles: {
    pattern: '/**/less/**/*.less',
    splitFolder: 'less',
    distFolder: 'css',
  },
  fonts: {
    pattern: '/**/fonts/**/*.*',
    splitFolder: 'fonts',
    distFolder: 'fonts',
  },
  docs: {
    pattern: '/**/docs/**/*.*',
    splitFolder: 'docs',
    distFolder: 'docs',
  },
  images: {
    pattern: '/**/img/**/*.*',
    splitFolder: 'img',
    distFolder: 'img',
  },
};

getDestPath = (path, splitFolder, distFolder, withExtension = false) => {
  const temp = path.split(splitFolder);

  let beforeFolder = temp[0].split('/').slice(-2)[0];
  if (beforeFolder === 'webpack') {
    beforeFolder = 'bundles';
  }

  let afterFolder = temp[1];
  if (withExtension === false) {
    afterFolder = afterFolder.split('.')[0];
  }
  afterFolder = afterFolder.split('/entry')[0];

  return `${beforeFolder}/${distFolder}${afterFolder}`;
};

getFilesByPattern = ({ pattern, splitFolder, distFolder }) => {
  const res = {};

  paths.forEach((path) => {
    glob.sync(path + pattern).forEach((filePath) => {
      res[getDestPath(filePath, splitFolder, distFolder)] = filePath;
    });
  });

  return res;
};

module.exports = {
  entry: {
    ...getFilesByPattern(pattern.scripts),
    ...getFilesByPattern(pattern.react),
  },
  output: {
    path: dist.build,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [
          '/node_modules/',
        ],
        resolve: {
          extensions: ['.ts', '.js', '.jsx'],
        },
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: true,
            },
          },
        ],
      },
      {
        test: /\.less$/,
        exclude: /\.module\.less$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: !isProduction(),
              url: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: require('./postcss.config.js')
            }
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: !isProduction(),
            },
          },
        ],
      },
      {
        test: /\.module\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: !isProduction(),
              url: false,
              modules: "local",
              localIdentName: "[name]__[local]___[hash:base64:5]"
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: !isProduction(),
              config: {
                path: './postcss.config.js',
              },
            },
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: !isProduction(),
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/,
        exclude: /\.module\.s[ac]ss$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: !isProduction(),
              url: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: !isProduction(),
              config: {
                path: './postcss.config.js',
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: !isProduction(),
            },
          },
        ],
      },
      {
        test: /\.module\.s[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: !isProduction(),
              url: false,
              modules: "local",
              localIdentName: "[name]__[local]___[hash:base64:5]"
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: !isProduction(),
              config: {
                path: './postcss.config.js',
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: !isProduction(),
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: !isProduction(),
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: !isProduction(),
              config: {
                path: './postcss.config.js',
              },
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|gif|png|svg)$/i,
        use: [
          {
            loader: 'url-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new WebpackBar({
      profile: true,
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    }),
    
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
  stats: 'minimal',
};
