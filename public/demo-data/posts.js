var posts = [
  {
    sourceType: 'link',
    sourceUrl: 'http://google.com',
    sourceService: 'The Huffington Post',
    title: 'Donec Congue Lacinia Dui, A Porttitor Lectus',
    description: 'In pellentesque faucibus vestibulum. Nulla at nulla justo, eget luctus tortor. Nulla facilisi. Duis aliquet egestas purus in blandit. Curabitur vulputate, ligula lacinia scelerisque tempor, lacus lacus ornare ante, ac egestas est urna sit amet arcu. Class aptent taciti sociosqu ad litora',
    image: '/img/sample/posts/link-00.jpg',
    imageWidth: 350,
    imageHeight: 238,
    total_reposts: 12,
    total_saves: 4,
    createdAt: '2015-01-10T13:59:47Z',
  },

  {
    sourceType: 'link',
    sourceUrl: 'http://google.com',
    sourceService: 'The Huffington Post',
    title: 'Donec Congue Lacinia Dui, A Porttitor Lectus',
    description: '',
    image: '/img/sample/posts/link-01.jpg',
    imageWidth: 350,
    imageHeight: 195,
    total_reposts: 12,
    total_saves: 4,
    createdAt: '2015-01-12T13:59:47Z',
  },

  {
    sourceType: 'link',
    sourceUrl: 'http://google.com',
    sourceService: 'The Huffington Post',
    title: 'Donec Congue Lacinia Dui, A Porttitor Lectus',
    description: 'In pellentesque faucibus vestibulum. Nulla at nulla justo, eget luctus tortor. Nulla facilisi. Duis aliquet egestas purus in blandit. Curabitur vulputate, ligula lacinia scelerisque tempor, lacus lacus ornare ante, ac egestas est urna sit amet arcu. Class aptent taciti sociosqu ad litora',
    image: '',
    total_reposts: 12,
    total_saves: 4,
    createdAt: '2015-02-09T13:59:47Z',
  },

  {
    sourceType: 'video',
    sourceUrl: 'https://www.youtube.com/watch?v=20Whc4WIz-Y',
    sourceService: 'youtube',
    title: 'Lorem Ipsum Dolor Sit Amet, Consectetur',
    description: 'Curabitur vulputate, ligula lacinia scelerisque tempor, lacus lacus ornare ante, ac egestas est urna sit amet arcu. Class aptent taciti sociosqu ad litora torquent per conubia.',
    image: '/img/sample/posts/video-00.jpg',
    imageWidth: 350,
    imageHeight: 197,
    total_reposts: 2,
    total_saves: 1,
    createdAt: '2015-02-28T13:59:47Z'
  },

  {
    sourceType: 'video',
    sourceUrl: 'https://www.youtube.com/watch?v=Opktm709TJo',
    sourceService: 'youtube',
    title: 'Lorem Ipsum Dolor Sit Amet, Consectetur',
    description: '',
    image: '/img/sample/posts/video-01.jpg',
    imageWidth: 350,
    imageHeight: 194,
    total_reposts: 2,
    total_saves: 1,
    createdAt: '2015-03-30T13:59:47Z'
  },

  {
    sourceType: 'video',
    sourceUrl: 'https://www.youtube.com/watch?v=20Whc4WIz-Y',
    sourceService: 'youtube',
    title: '',
    description: '',
    image: '/img/sample/posts/video-02.jpg',
    imageWidth: 350,
    imageHeight: 256,
    total_reposts: 2,
    total_saves: 1,
    createdAt: '2015-04-10T13:59:47Z'
  },

  {
    sourceType: 'link',
    sourceUrl: 'http://google.com',
    sourceService: 'The Guardian',
    title: 'Nulla Facilisi. Duis Aliquet Egestas Purus In Blandit. Curabitur',
    description: '',
    image: '/img/sample/posts/image-00.jpg',
    imageWidth: 350,
    imageHeight: 218,
    total_reposts: 2,
    total_saves: 1,
    createdAt: '2015-04-23T13:59:47Z',
  },

/*
  {
    sourceType: 'audio',
    sourceUrl: '/img/sample/Halloween_Vocals-Mike_Koenig-517765553.mp3',
    sourceService: '',
    audio_duration: '0:33',
    title: 'Donec Congue Lacinia Dui, A Porttitor Lectus',
    description: 'Curabitur vulputate, ligula lacinia scelerisque tempor, lacus lacus ornare ante, ac egestas est urna sit amet arcu. Class aptent taciti sociosqu ad litora torquent per conubia.',
    image: '/img/sample/posts/image-01.jpg',
    total_reposts: 12,
    total_saves: 4,
    createdAt: '2015-03-30T13:59:47Z'
  },

  {
    sourceType: 'audio',
    sourceUrl: 'http://soundbible.com/grab.php?id=2080&type=mp3',
    sourceService: '',
    audio_duration: '0:33',
    title: 'Donec Congue Lacinia Dui, A Porttitor Lectus',
    description: 'Curabitur vulputate, ligula lacinia scelerisque tempor, lacus lacus ornare ante, ac egestas est urna sit amet arcu. Class aptent taciti sociosqu ad litora torquent per conubia.',
    image: '/img/sample/posts/image-01.jpg',
    total_reposts: 12,
    total_saves: 4,
    createdAt: '2015-03-30T13:59:47Z'
  },

  {
    sourceType: 'audio',
    sourceUrl: 'http://upload.wikimedia.org/wikipedia/commons/1/15/Alice_Arnold_voice.ogg',
    sourceService: '',
    audio_duration: '0:15',
    title: 'Donec Congue Lacinia Dui, A Porttitor Lectus',
    description: '',
    image: '/img/sample/posts/image-02.jpg',
    total_reposts: 12,
    total_saves: 4,
    createdAt: '2015-03-30T13:59:47Z'
  },

  {
    sourceType: 'audio',
    sourceUrl: 'http://upload.wikimedia.org/wikipedia/commons/2/27/Edmund_Yeo_-_voice_-_ch_150127_1828.wav',
    sourceService: '',
    audio_duration: '0:29',
    title: 'Donec Congue Lacinia Dui, A Porttitor Lectus',
    description: 'Curabitur vulputate, ligula lacinia scelerisque tempor, lacus lacus ornare ante, ac egestas est urna sit amet arcu. Class aptent taciti sociosqu ad litora torquent per conubia.',
    image: '',
    total_reposts: 12,
    total_saves: 4,
    createdAt: '2015-03-30T13:59:47Z'
  },

  {
    sourceType: 'audio',
    sourceUrl: 'http://upload.wikimedia.org/wikipedia/commons/0/06/Dewey-Hagborg.ogg',
    sourceService: '',
    audio_duration: '0:47',
    title: '',
    description: '',
    image: '',
    total_reposts: 12,
    total_saves: 4,
    createdAt: '2015-03-30T13:59:47Z'
  },
*/

  {
    sourceType: 'image',
    sourceUrl: '',
    sourceService: '',
    title: 'In Condimentum Facilisis Porta Sed Nec Diam Eu Diam',
    description: 'Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue.',
    image: '/img/sample/posts/image-03.jpg',
    imageWidth: 287,
    imageHeight: 318,
    total_reposts: 62,
    total_saves: 17,
    createdAt: '2015-05-12T13:59:47Z'
  },

  {
    sourceType: 'image',
    sourceUrl: '',
    sourceService: '',
    title: 'In Condimentum Facilisis Porta Sed Nec Diam Eu Diam',
    description: '',
    image: '/img/sample/posts/image-04.jpg',
    imageWidth: 350,
    imageHeight: 232,
    total_reposts: 62,
    total_saves: 17,
    createdAt: '2015-05-27T13:59:47Z'
  },

  {
    sourceType: 'image',
    sourceUrl: '',
    sourceService: '',
    title: '',
    description: '',
    image: '/img/sample/posts/image-05.jpg',
    imageWidth: 350,
    imageHeight: 189,
    total_reposts: 62,
    total_saves: 17,
    createdAt: '2015-06-01T13:59:47Z'
  },

  {
    sourceType: 'quote',
    sourceUrl: '',
    sourceService: '',
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.',
    description: 'Sergio De La Garza, 1978',
    image: '',
    total_reposts: 0,
    total_saves: 0,
    createdAt: '2015-06-14T13:59:47Z'
  },

  {
    sourceType: 'video',
    sourceUrl: 'https://vimeo.com/20729832',
    sourceService: 'vimeo',
    title: 'In Pellentesque Faucibus Vestibulum. Nulla At Nulla',
    description: 'Curabitur vulputate, ligula lacinia scelerisque tempor, lacus lacus ornare ante, ac egestas est urna sit amet arcu. Class aptent taciti sociosqu ad litora torquent per conubia.',
    image: '/img/sample/posts/video-03.jpg',
    imageWidth: 350,
    imageHeight: 193,
    total_reposts: 2,
    total_saves: 1,
    createdAt: '2015-07-04T13:59:47Z'
  }
]
module.exports = posts;
