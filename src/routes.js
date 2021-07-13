import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Clientes from './pages/Clientes'
import Produtos from './pages/Produtos'
import Facturas from './pages/Facturas'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  root: { flexGrow: 1 },
  title: { flexGrow: 1 }
}));

const Routes = () => {
  const classes = useStyles()

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>Sistema de Facturas</Typography>
        </Toolbar>
      </AppBar>
      <BrowserRouter>
        <Switch>
          <Route path='/' exact={true} component={Dashboard} />
          <Route path='/clientes' component={Clientes} />
          <Route path='/produtos' component={Produtos} />
          <Route path='/facturas' component={Facturas} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default Routes;