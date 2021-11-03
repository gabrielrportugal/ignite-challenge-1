import { GetStaticProps } from 'next';

import Prismic from '@prismicio/client';
import ptBR from 'date-fns/locale/pt-BR';
import { format } from 'date-fns';
import { RichText } from 'prismic-dom';
import Link from 'next/link';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  return (
    <div>
      {postsPagination.results.map(post => (
        <Link href={`/posts/${post.uid}`}>
          <a key={post.uid} className={styles.post}>
            <strong>{post.data.title}</strong>
            <p>{post.data.subtitle}</p>
          </a>
        </Link>
      ))}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 20,
    }
  );

  const results = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.last_publication_date),
        'd MMMM yyyy',
        { locale: ptBR }
      ),
      data: {
        title: RichText.asText(post.data.title),
        subtitle: RichText.asText(post.data.subtitle),
        author: RichText.asText(post.data.author),
      },
    };
  });

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page || '',
        results,
      },
    },
  };
};
