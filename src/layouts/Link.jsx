import React from 'react';
import Link from 'umi/link';
import route from './route.js';

const path2component = pathname => {
	let pathArr = ['ROOT'];
	let l = 0, r = 0, len = pathname.length;
	while (r <= len) {
		if (pathname[r] === '/' || r === len) {
			const p = pathname.substr(l, r - l);
			l = r + 1;
			if (p === '' || p === '.') {
				;
			} else if (p === '..') {
				if (pathArr.length === 1) {
					throw 'access path over root';
				} else {
					pathArr.pop();
				}
			} else {
				pathArr.push(p);
			}
		}
		r++;
	}
	const dfs = (subdir, i) => {
		if (i >= pathArr.length) {
			console.log(pathArr, i);
			throw `component not found: ${pathname}`;
		} else if (!(pathArr[i] in subdir) && !('*' in subdir)) {
			console.log(pathArr, i);
			throw `component not found: ${pathname}`;
		}
		const dirname = pathArr[i] in subdir ? pathArr[i] : '*';
		if (i === pathArr.length - 1) {
			return subdir[dirname].component;
		} else {
			return dfs(subdir[dirname].children, i + 1);
		}
	};
	return dfs(route, 0);
};

class MyLink extends React.Component {
	nav(props) {
		const pageName = path2component(props.to.pathname)
		console.log(pageName)
		props.to.pathname = pageName
		window.managePage.showPage(props)
	}
	render() {
		let style = {
			color: '#1890ff',
			cursor: 'pointer'
		}
		return <div style={style} onClick={this.nav.bind(this, this.props)}>{this.props.children}</div>
	}

}
export default Link

