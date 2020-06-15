import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import * as router from 'react-router-dom';
import { Container } from 'reactstrap';
import http from '../../api/http';
import {
  AppAside,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppBreadcrumb2 as AppBreadcrumb,
  AppSidebarNav2 as AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
// routes config
import routes from '../../routes';

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));
const HeaderNav = React.lazy(() => import('./HeaderNav'));

class DefaultLayout extends Component {

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  signOut(e) {
    //e.preventDefault()
    this.props.history.push('/login')
  }

  constructor(props) {
    super(props);
    this.state={
      user:{
        id:null,
        username:"",
        firstName:"",
        lastName:""
      }
    };
    http.session().then(result => {
      this.setState({
        user: result
      })
    })
  }

  render() {
    return (
      <div className="app">

        <HeaderNav user={this.state.user} onLogout={e=>this.signOut(e)} />

        {/*<AppHeader fixed>
          <Suspense  fallback={this.loading()}>
            <DefaultHeader user={this.state.user} onLogout={e=>this.signOut(e)}/>
          </Suspense>
        </AppHeader>*/}
        <div className="app-body">
          {/*<AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
            <AppSidebarNav navConfig={navigation} {...this.props} router={router}/>
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>*/}
          <main className="main">
{/*
            <AppBreadcrumb appRoutes={routes} router={router}/>
*/}
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (
                          <route.component {...props} />
                        )} />
                    ) : (null);
                  })}
                  <Redirect from="/" to="/Management/warehouse" />
                </Switch>
              </Suspense>
            </Container>
          </main>
          <AppAside fixed>
            <Suspense fallback={this.loading()}>
              <DefaultAside />
            </Suspense>
          </AppAside>
        </div>
        {/*<AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>*/}
      </div>
    );
  }
}

export default DefaultLayout;
