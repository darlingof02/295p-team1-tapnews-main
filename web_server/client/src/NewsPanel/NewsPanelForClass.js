import './NewsPanel.css';
import _ from 'lodash';
import React from 'react';
import Auth from '../Auth/Auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IP } from '../const';

import NewsCard from '../NewsCard/NewsCard';
import { Link, withRouter} from 'react-router-dom';

class NewsPanelForClass extends React.Component {
    constructor(props) {
        
        super(props);
        this.state = { news: null, pageNum: 1, totalPages: 1, loadedAll: false, category: this.props.match.params.category, likelist:[]};
        this.handleScroll = this.handleScroll.bind(this);
        this.renderNews = this.renderNews.bind(this);
        
    }

    componentDidMount() {
        if (Auth.isUserAuthenticated()) {
            this.loadClassNews();
            this.loadLike()
        }

        // 防抖

        this.loadMoreNews = _.debounce(this.loadClassNews, 1000);
        window.addEventListener('scroll', this.handleScroll);
    }
    handleScroll() {
        let scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        if ((window.innerHeight + scrollY) >= (document.body.offsetHeight - 50)) {
            // 滚动到了最底部。
            console.log('Loading more news');
            this.loadClassNews();
        }
    }
    loadClassNews(e) {
        if (this.state.loadedAll === true) {
            return;
        }
        let url = `http://${IP}:3000/news/userId/` + Auth.getEmail() + `/${this.state.category}/pageNum/` + this.state.pageNum
        let request = new Request(encodeURI(url), {
            method: 'GET',
            headers: {
                'Authorization': 'bearer ' + Auth.getToken(),
            },
            cache: 'no-cache',
        });

        fetch(request)
            .then((res) => res.json())
            .then((news) => {
                console.log("category" + this.state.category)
                console.log(news)
                console.log("category" + this.state.category)

                if (!news || news.length === 0) {
                    this.setState({ loadedAll: true });
                }
                this.setState({
                    news: this.state.news ? this.state.news.concat(news) : news,
                    pageNum: this.state.pageNum + 1
                });
            });
    }
    unique (arr) {
        let len = arr.length
        for (let i = 0; i < len; i++) {

            for (let j = i + 1; j < len; j++) {
                if (arr[i].digest === arr[j].digest) {
                    arr.splice(j, 1)
                    len-- // 减少循环次数提高性能
                    j-- // 保证j的值自加后不变
                }
            }
        }
        return arr
    }
    renderNews() {
        let category = this.state.category
        this.state.news=this.unique(this.state.news)
        var temp=this.state.likelist
        var news_list = this.state.news.map(function (news) {

            if (news.class == category)
                return (
                <a className='list-group-item' key={news.digest} href="#">
                    <NewsCard news={news} likelist={temp}/>
                </a>
                );
            else
                return <div></div>
        });
        return (
            <div className="container-fluid">
                <div className='list-group'>
                    {news_list}
                </div>
            </div>
        );
    }
    loadLike(e) {
        // if (this.state.loadedAll === true) {
        //     return;
        // }
        let url = `http://${IP}:3000/news/getlike/userId/` + Auth.getEmail() + '/pageNum/' + this.state.pageNum
        let request = new Request(encodeURI(url), {
            method: 'GET',
            headers: {
                'Authorization': 'bearer ' + Auth.getToken(),
            },
            cache: 'no-cache',
        });

        fetch(request)
            .then((res) => res.json())
            .then((list) => {
                //console.log(list)
                this.setState({ likelist:list});
                // if (!news || news.length === 0) {
                //     this.setState({ loadedAll: true });
                // }
                // this.setState({
                //     news: this.state.news ? this.state.news.concat(news) : news,
                //     pageNum: this.state.pageNum + 1
                // });
            });
    }

    render() {
        if (Auth.isUserAuthenticated()) {
            if (this.state.news) {
                return (
                    <div>
                        {this.renderNews()}
                    </div>
                );
            } else {
                return (
                    <div>
                        <div id='msg-app-loading'>
                            Loading
                        </div>
                    </div>
                )
            }
        } else {
            this.props.history.replace("/login")

            return (
                <div className='container'>
                    Please login first
                </div>
            )
        }
    }
}

// export default NewsPanel;
export default withRouter(NewsPanelForClass);
