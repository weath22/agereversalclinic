import fs from 'fs';

let content = fs.readFileSync('src/lib/adminStore.ts', 'utf8');

const newGalleryConfig = `const DEFAULT_GALLERY_CONFIG: BeforeAfterGalleryConfig = {
  heading: "Before & After Gallery",
  description: "Witness the transformative journeys of our patients. These unretouched, real clinical cases illustrate the precision-guided results we achieve daily across our specialist disciplines.",
  categories: [
    {
      id: 'anti-aging',
      name: 'Anti-Aging Rejuvenation',
      pairs: [
        {
          id: 'pair-1',
          title: 'Skin Treatment - 12 Wks',
          beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6YRX4oWEimDRlPfT4ZvP49QVjagike9HlAOT7FsLhwf61UL4dCKCGWr1FS7SmMqMhd9VheV3RuR4bKmR_H3dRMFEAxUvuwj56dIFiriv8niGvOiz7XVef6Gjx4h3iHxaFayLl_g4p2ViKYOGEKxMw4bAR7W5VL-rkDMyy7LQjrabplnGUsrY6j9fECzUiFYmk_OZ_-hBZJAePOaKJjK0lqqjd7ahusnbsXJYKmIG5Rs5lmafypBuU_b9wqYQQG0v8O8BfCz2mokhu',
          afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtnTWTfvtjmgPs1n1Q2b5gdUnZqNuGV3e-_ZLF0KZFSWWrFhA3eAIX2iTTuaY-hDvVwQ5PKReB6fFMP3tq1WnzmcGJr11CXLsLkYmYd8zLGLdL5zETq6wohVWzqLcykLevZUPnJ_LG55HukqRiTUllO8pE80UJFXvPUytiYATX5fbzVCDVz_cqX20l_6dKdFzb4UaffXMlUAbDiZwQL531mZiVM9lUuSozSA_-uLXJhit8mpHzT04T8XOmmy7yIYQyPOkWqJTIqPfO'
        },
        {
          id: 'pair-5',
          title: 'Anti-Aging - 8 Wks',
          beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQHcq9zpePKkMqtIMFzx_zJA6A2MHoEn6csMvjhOOX7ANTgntEGIHbHHzkJdrRGuvr_rnNYa6j_vcZm7V9bkSv83qNQwd18XJJA14YTUOLU2diwqx3hP_e-l8axRA5ZOsfN1xGiRO0pPe2sb4cNQEz8psyAxBRjvefn1MvexT-2iAwkVKIyT8R_56LKMScwW7_sMvuBzMGXxdp0I1cFNoqfp7K5RhhrtrwcfrUPw1dRPmX60Zc0esbeUgaFqwO959IBqnu8sf8OA4w',
          afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZoLjpjMEmJNM6EwzVC9AzZEWfQUVa-TmVyM-NgPL8ONCjzwY7nZ6rFqOxJ9jyK0OMnlIij8h8SOt93jaHfSglwGqtwAN3uabUuoux0yNyPzieFFX7iyB4YhjLSsBzd2BRDjEDVB1RlXcG4VC8SswApL8QbBnPLshzCzMX8LSdFYZsa0PRI6MM6b7I67HIl-B6YLhZAH5ZI9mcghNQsybRemIqmq4LWl9BCKjn5KaTyU1RyMrHYkwMgx1ABZOJ1-OJiLkjF-5mIKY0'
        }
      ]
    },
    {
      id: 'acne-scarring',
      name: 'Acne & Scarring',
      pairs: [
        {
          id: 'pair-2',
          title: 'Laser Therapy & Skin Revision',
          beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKPf3nijQRz9NaEd_b-5EiczAejYyrgh_dwMC6S-1-7Hi8EJJnt8_x2x-i1qG-qJ0BxvXbk_PeIeusHvMggQrPf2ijjCJ-yYtr-Ur19sJw4_NIIAlLMv1S2ct_OUVp3CJNba1hCLXrrPOcfhQAQUcgqZJFcuUL6Q4KXUwM1ALRAeo6Bb79xdI4FoLRUFAP9_MlbZ8tUedBAnuVrheDWpnRtLnB17gtdOx3OFGMbTVs5jhXXnZD6b-y7OCBnlBNOtqOPMcKxAdzDKRk',
          afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFNbqNx3wVVcZoA9IP87KJkDnMZI-8uRSd-RL2-LhuxC6ADEkgMcpBDJ22CU3U7a_ZOllNge5XasdFvVaBYUhCDohAZdRi0HT1ymJ1s_FMyiXt8pJl7NGhaLkKATrZlXl3B2mFW01fD4Mzp3ixyyLcDfCdjXdPi58MzBZ-GTgGk7w7Ks96hydwAbc4rURmQ3Pel8YEcOvxIX5UbwIKvB4OdEuyDc-z_RnH-USDoP7hJ2AJkw4zTdCS7FDF6Vo4RFbWikgnECIa4gKP'
        }
      ]
    },
    {
      id: 'facial-harmony',
      name: 'Facial Harmony',
      pairs: [
        {
          id: 'pair-3',
          title: 'Advanced Aesthetics',
          beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD20NLhroXmHS02eweFz9RBF-OhZ1RaQuMYe3uKrQ3iyvZ-roWLw57bJ33sw80W5DRjj47x5XfDBbMjHImuC7GRyDB99DirCCEbVZV8CTtkxIlVvsv3muJIAVMTHXiXqyc5zkYEu_ONKT40va6LO1TTmuJIgnYDdf4IauNPrqGL0pqV8S7wijzbRu89PlKh7cdxVcMqll1kYNG8e8Oy-dy4Ftdm6rYT9ZMn2IlwhqOYW0ekq6d9NnIYN_xGqSaNcN5s4N1iiVJMk3GV',
          afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDccMXAIYxuO2yvwTqN8m4d8QLiy48sfir-uvPIXURN6mHE9KnhgzWARsOBlK9Mr7YK53ev5SNz0PPuGxVRLSblgomVrpZxwnyuJUkmY-Ozf1hCAotsXBatMbvNCyS04ZJlkaYgvTJNROZ-js6VboTaV_3ll-A3k6pNoAAipu9StjstMbS0Laznf_O50IKrmUFaecZ-yeGpZtc8RnmuWeJ_Qsqe53K1Vl0UbckdWbcqY249cXQYBmdHpG1v0uiCq0Ly6hPEjF90b3le'
        }
      ]
    },
    {
      id: 'clinical-hair',
      name: 'Clinical Hair Restoration',
      pairs: [
        {
          id: 'pair-4',
          title: 'Vertical Comparison',
          beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAt4dLQWWadBxtTzBpplagu2J9MUvwKtNJkgViQjChgH82bAH_iO6gF6p-TSVCSZ2jViPeml_xgEZ7Iq6F_NEVjRCtxJ7KhPFDOYT5byV1VJXaplQwCg6QybxEWi8wHT_QpGlWU8xBqFyhtpBZao172mEYVtF0UVKABJBqCwM5SU30IS2ON1eLnGldXQRWwBGjBQU7aTfniH71oyqdfhnTK_-tGbm5YfhUmEG8QjW9Nsh3NLL2fC3UAJ83TDu-VoVMkNkLRQQdclSVR',
          afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkakM8tbhNmtYeKmoQBAAzTei0SDwQVg3jf4IfrTGNP8I8WmzYu8BL-eZUD6ccSBm9fY3UgWCvjrJX1rBeyzCvPpnD3Fa7-r7rI5pw8wP459wQIwtGxvpKIrc7paJJ_LgbbcH6SrOD3cwg6mM0x7ZahhhPNgqR7PkR4wXem9rqOpBJQQq8lP3Zmij233vHOLihq3N7Pxxs00WXjWevFzHxFsHzlNU6_pv9H7yfM-0JpAPd-C0UGYVLJ7BZ6WyP8HWAt41DR1q8v6Hd'
        }
      ]
    }
  ]
};`;

content = content.replace(/const DEFAULT_GALLERY_CONFIG:\s*BeforeAfterGalleryConfig\s*=\s*\{[\s\S]*?\n\};\n*(?=const DEFAULT_WHY_CHOOSE_US_CONFIG)/, newGalleryConfig + '\n\n');
content = content.replace(/const GALLERY_CONFIG_KEY\s*=\s*'[^']+';/, "const GALLERY_CONFIG_KEY = 'homepage_gallery_config_v6';");

fs.writeFileSync('src/lib/adminStore.ts', content);
