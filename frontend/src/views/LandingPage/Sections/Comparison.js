import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import StarIcon from '@material-ui/icons/StarBorder';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
    ul: {
      margin: 0,
      padding: 0,
    },
    li: {
      listStyle: 'none',
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardHeader: {
    backgroundColor: theme.palette.grey[200],
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#05b169',
    padding: 10
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
}));

const tiers = [
  {
    title: 'SecretPay Standard',
    description: ['Trustless and decentralised OTC',
    'Ethereum escrow smart contract',
    'Payments: Revolut and Paypal',
    'No sign-ups',
    'Unencrypted FIAT invoice details',
    'Vulnerable to third party access of invoice details',
    'Chainlink payment verification'],
    buttonText: 'Trade Now',
    buttonVariant: 'contained',
    buttonLink: 'https://SecretPay.io/standard'
  },
  {
    title: 'SecretPay Secret',
    description: [
      'Trustless and decentralised OTC',
      'Ethereum escrow smart contract',
      'Payments: Revolut and Paypal',
      'Requires Blockstack decentralised identity',
      'Encrypted FIAT invoice details',
      'Trade details only accessible by the buyer, seller and Chainlink oracles',
      'Chainlink payment verification'
    ],
    buttonText: 'Trade Secretly',
    buttonVariant: 'contained',
    buttonLink: 'https://SecretPay.io/secret'
  }
];

export default function Comparison() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      {/* End hero unit */}
      <Container maxWidth="md" component="main">
        <Grid container spacing={5}>
          {tiers.map(tier => (
            // Enterprise card is full width at sm breakpoint
            <Grid item key={tier.title} xs={12} sm={6}>
              <Card>
                <CardHeader
                  title={tier.title}
                  subheader={tier.subheader}
                  titleTypographyProps={{ align: 'center' }}
                  subheaderTypographyProps={{ align: 'center' }}
                  action={tier.title === 'Pro' ? <StarIcon /> : null}
                  className={classes.cardHeader}
                />
                <CardContent>
                  {/* <div className={classes.cardPricing}>
                    <Typography component="h2" variant="h3" color="textPrimary">
                      ${tier.price}
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                      /mo
                    </Typography>
                  </div> */}
                  <ul>
                    {tier.description.map(line => (
                      <Typography component="li" variant="subtitle1" align="center" key={line}>
                        {line}
                      </Typography>
                    ))}
                  </ul>
                </CardContent>
                <CardActions>
                                <Link style={{flex:1,
                    flexDirection:'row',
                    alignItems:'center',
                    justifyContent:                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                'center',}} to={tier.buttonLink}>
                  <Button fullWidth color="primary" href={tier.buttonLink} variant={tier.buttonVariant}>
                    {tier.buttonText}
                  </Button>
                 </Link>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      {/* End footer */}
    </React.Fragment>
  );
}