import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Produtos from './pages/Produtos';
import Facturas from './pages/Facturas';

const Routes = () => {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/' exact={true} component={Dashboard} />
          <Route path='/clientes' component={Clientes} />
          <Route path='/produtos' component={Produtos} />
          <Route path='/facturas' component={Facturas} />
        </Switch>
      </BrowserRouter>
    );
}

export default Routes;