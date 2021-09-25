import Faker from 'faker';
import { StatusEnum } from 'src/common/enums/status.enum';
import { CategoryEntity } from 'src/entities/category.entity';
import { PostEntity } from 'src/entities/post.entity';
import { ThemeEntity } from 'src/entities/theme.entity';
import { UserEntity } from 'src/entities/user.entity';
import { define } from 'typeorm-seeding';

define(UserEntity, (faker: typeof Faker) => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();

  const user = new UserEntity();
  user.firstName = firstName;
  user.lastName = lastName;
  user.password_hash = '$2b$12$/sLCxkUxUdb1KGdfRmq9oeaWMUCcB9SZmRdIqXbzZIkN4lCB3Yfx6';
  user.isActive = true;
  user.activatedAt = new Date();
  user.email = faker.internet.email(firstName, lastName).toLowerCase();
  user.phone = `${Math.round(Math.random() * 89999999999)}`;
  user.status = StatusEnum.ACTIVE;

  return user;
});

define(PostEntity, (
  faker: typeof Faker,
  settings: {
    category: CategoryEntity;
    user: UserEntity;
    themes: ThemeEntity[];
  },
): PostEntity => {
  const model = new PostEntity();
  model.status = StatusEnum.ACTIVE;
  model.title = faker.name.title();
  model.description = faker.lorem.text();
  model.img = faker.image.food();
  model.user = settings.user;
  model.category = settings.category;
  model.body = JSON.stringify({
    time: 1618426498893,
    blocks: [
      {
        type: 'header',
        data: {
          text: 'Editor.js',
          level: 2,
        },
      },
      {
        type: 'paragraph',
        data: {
          text: 'Hey. Meet the new Editor. On this page you can see it in action — try to edit this text.',
        },
      },
      {
        type: 'header',
        data: {
          text: 'Key features',
          level: 3,
        },
      },
      {
        type: 'list',
        data: {
          style: 'unordered',
          items: [
            'It is a block-styled editor',
            'It returns clean data output in JSON',
            'Designed to be extendable and pluggable with a simple API',
          ],
        },
      },
      {
        type: 'header',
        data: {
          text: 'What does it mean «block-styled editor»',
          level: 3,
        },
      },
      {
        type: 'paragraph',
        data: {
          text:
            'Workspace in classic editors is made of a single contenteditable element, used to create different HTML markups. Editor.js <mark class="cdx-marker">workspace consists of separate Blocks: paragraphs, headings, images, lists, quotes, etc</mark>. Each of them is an independent contenteditable element (or more complex structure) provided by Plugin and united by Editor\'s Core.',
        },
      },
      {
        type: 'paragraph',
        data: {
          text:
            'There are dozens of <a href="https://github.com/editor-js">ready-to-use Blocks</a> and the <a href="https://editorjs.io/creating-a-block-tool">simple API</a> for creation any Block you need. For example, you can implement Blocks for Tweets, Instagram posts, surveys and polls, CTA-buttons and even games.',
        },
      },
      {
        type: 'header',
        data: {
          text: 'What does it mean clean data output',
          level: 3,
        },
      },
      {
        type: 'paragraph',
        data: {
          text:
            'Classic WYSIWYG-editors produce raw HTML-markup with both content data and content appearance. On the contrary, Editor.js outputs JSON object with data of each Block. You can see an example below',
        },
      },
      {
        type: 'paragraph',
        data: {
          text:
            'Given data can be used as you want: render with HTML for <code class="inline-code">Web clients</code>, render natively for <code class="inline-code">mobile apps</code>, create markup for <code class="inline-code">Facebook Instant Articles</code> or <code class="inline-code">Google AMP</code>, generate an <code class="inline-code">audio version</code> and so on.',
        },
      },
      {
        type: 'paragraph',
        data: {
          text: 'Clean data is useful to sanitize, validate and process on the backend.',
        },
      },
      {
        type: 'delimiter',
        data: {},
      },
      {
        type: 'paragraph',
        data: {
          text:
            "We have been working on this project more than three years. Several large media projects help us to test and debug the Editor, to make it's core more stable. At the same time we significantly improved the API. Now, it can be used to create any plugin for any task. Hope you enjoy. 😏",
        },
      },
      {
        type: 'image',
        data: {
          file: {
            url: 'https://codex.so/public/app/img/external/codex2x.png',
          },
          caption: '',
          withBorder: false,
          stretched: false,
          withBackground: false,
        },
      },
    ],
    version: '2.20.1',
  });

  model.themes = settings.themes;

  return model;
});
