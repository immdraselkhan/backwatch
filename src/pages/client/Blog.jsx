import React from 'react'
import { createStyles, Image, Accordion, Grid, Col, Container, Title } from '@mantine/core'
import { useDocumentTitle } from '@mantine/hooks'
import FaqImage from '../../assets/faq.svg'

const useStyles = createStyles((theme) => ({
  wrapper: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  title: {
    marginBottom: theme.spacing.xl * 5,
  },

  item: {
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
  },
}));

const faqs = [
  {
    question: 'What are the different ways to manage a state in a React application?',
    answer: 'There are four main types of state of React: (1) Local (UI) state - Local state is data we manage in one or another component. (2) Global (UI) state - Global state is data we manage across multiple components. (3) Server state - Data that comes from an external server that must be integrated with our UI state. (4) URL state - Data that exists on our URLs, including the pathname and query parameters.',
  },
  {
    question: 'How does prototypical inheritance work?',
    answer: 'The Prototypal Inheritance is a feature in javascript used to add methods and properties in objects. It is a method by which an object can inherit the properties and methods of another object. Traditionally, in order to get and set the [[Prototype]] of an object, we use Object. getPrototypeOf and Object.',
  },
  {
    question: 'What is a unit test? Why should we write unit tests?',
    answer: 'The main objective of unit testing is to isolate written code to test and determine if it works as intended. Unit testing is an important step in the development process, because if done correctly, it can help detect early flaws in code which may be more difficult to find in later testing stages.'
  },
  {
    question: 'React vs. Angular vs. Vue?',
    answer: 'Vue provides higher customizability and hence is easier to learn than Angular or React. Further, Vue has an overlap with Angular and React with respect to their functionality like the use of components. Hence, the transition to Vue from either of the two is an easy option.'
  }
]

const Blog = () => {
  // Set page title
  useDocumentTitle('Blog - BackWatch');
  const {classes} = useStyles();
  return (
    <div className={classes.wrapper}>
      <Container size="xl">
        <Title align="center" className={classes.title}>
          Frequently Asked Questions
        </Title>
      </Container>
      <Container size="xl">
        <Grid id="faq-grid" gutter={50}>
          <Col span={12} md={6}>
            <Image src={FaqImage} alt="Frequently Asked Questions" />
          </Col>
          <Col span={12} md={6}>
            <Accordion chevronPosition="right" defaultValue="0" variant="separated">
              {
                faqs.map((faq, index) =>
                <Accordion.Item key={index} className={classes.item} value={`${index}`}>
                    <Accordion.Control>{faq.question}</Accordion.Control>
                  <Accordion.Panel>{faq.answer}</Accordion.Panel>
                </Accordion.Item>
              )}
            </Accordion>
          </Col>
        </Grid>
      </Container>
    </div>
  );
};

export default Blog;