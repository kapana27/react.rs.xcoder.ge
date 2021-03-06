import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import '../../../scss/style.scss';
import '../style.css';
import http from "../../../api/http";
import sygnet from '../../../assets/img/brand/sygnet.png';

class Login extends Component {

  constructor(props) {
    super(props);

    //http://10.0.2.34:7777/api/login?username=z.djodjua@rs.ge&password=4321a
    this.state={
      username:"",
      password:''
    }
  }

  render() {
    return (
      <div className="app flex-row align-items-center auth">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form>
                      <h1>ავტორიზაცია</h1>
                      <p className="text-muted">შედით თქვენს გვერდზე</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" placeholder="სახელი" value={this.state.username} autoComplete="username" onChange={e=>this.setState({username:e.target.value})} />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" placeholder="პაროლი" valid={this.state.password} autoComplete="current-password" onChange={e=>this.setState({password:e.target.value})} />
                      </InputGroup>
                      <Row>
                        <Col xs="5">
                          <Button color="primary" className="px-4"onClick={()=>this.login()}>შესვლა</Button>
                        </Col>
                       {/* <Col xs="7" className="text-right">
                          <Button color="link" className="px-0">პაროლის აღდგენა?</Button>
                        </Col>*/}
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <div style={{ width: '44%' }}>
                  <div className="main_logo">
                    <img src={sygnet}/>
                    <div className="company">შემოსავლების სამსახური</div>
                    <div className="name">ქონების მართვა</div>
                  </div>
                </div>
                {/*<Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.</p>
                      <Link to="/register">
                        <Button color="primary" className="mt-3" active tabIndex={-1}>Register Now!</Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>*/}
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  login=()=> {
    http.post("/api/login?username="+this.state.username+"&password="+this.state.password)
      .then((response)=>{
          setTimeout(()=>{
              window.location.href="/#/Management/warehouse"
          },100)
     })
  }
}

export default Login;
