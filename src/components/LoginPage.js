import React from 'react';
import { Link } from 'react-router';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

export default React.createClass ({
  getInitialState () {
    return { name: '', pass: '', error: null, load: false };
  },
  render () {
    if ( typeof this.props.state != 'undefined' && this.props.state.user  ) {
      return (
        <Paper style={{ margin: '8px', padding: '8px' }}>
          <h1 className="text-center">Welcome back <em>{this.props.state.user.name}</em> !</h1>
        </Paper>
      );
    }

    return (
      <Paper style={{ margin: '8px', padding: '8px' }}>
        <h1 className="text-center">Login</h1>
        <p className="text-center">
          아직도 가입을 안하셨습니까?
          <Link to='/signup' className="margin-horizontal">
            가입하러 가기
          </Link>
        </p>

        {this.state.error ? <p className="text-center text-error">{this.state.error}</p> : ''}

        <div className="align-center">
          <TextField hintText="아이디" id="username" name="username" type="text"
            value={this.state.name} onChange={(e) => this.handleChange ('name', e)} />
        </div>
        <div className="align-center">
          <TextField hintText="비밀번호" id="password" name="password" type="password"
            value={this.state.pass} onChange={(e) => this.handleChange ('pass', e)} />
        </div>
        <div className="align-center">
          {this.state.load ?
              <CircularProgress style={{ marginTop: '8px' }} size={40} thickness={5} /> :
              <RaisedButton primary={true} onClick={this.login} label="로그인" />}
        </div>
      </Paper>
    );
  },
  handleChange (type, e) {
    this.setState ({ [type]: e.target.value });
  },
  login () {
    this.setState ({ load: true });

    this.props.dispatch ({
      type: 'EMIT_SOCKET_IO',
      api: 'login:req',
      data: Object.assign ({}, this.state, { $user: this.props.state.user })
    });

    this.props.state.io.on ('login:res', (data) => {
      this.setState ({ load: false });

      if ( 'server_error' in data ) {
        console.warn (data.server_error);
      }
      else if ( data.error === null ) {
        this.props.dispatch ({
          type: 'SET_USER',
          data: data
        });
      }
      else this.setState ({ error: data.error });

      this.props.state.io.removeListener ('login:res');
    });
  }
});
