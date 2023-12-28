import React from "react";
import "./Footer.less";
import qrJoinImg from "../pages/home/img/qr_join.png";

export default () => {
    return (
        <div className="footer-con">
            <div className="footer-con-top">
                <div className="footer-con-item">
                    <span className="footer-item-level1">关于我们</span>
                    <span className="footer-item-level2">关于我们</span>
                    <span className="footer-item-level2">加入我们</span>
                </div>
                <div className="footer-con-item">
                    <span className="footer-item-level1">联系我们</span>
                    <span className="footer-item-level2">UI严选QQ群</span>
                    <span className="footer-item-level2">QQ1群</span>
                </div>
                <div className="footer-con-item">
                    <span className="footer-item-level1">帮组中心</span>
                    <span className="footer-item-level2">用户协议</span>
                    <span className="footer-item-level2">关于我们</span>
                </div>
                <div className="footer-con-item">
                    <span className="footer-item-level1">友情链接</span>
                    <span className="footer-item-level2">百度</span>
                    <span className="footer-item-level2">Google</span>
                </div>
                <div className="footer-con-qrImg">
                    <img src={qrJoinImg} alt="" className="footer-con-qrJoin" />
                    <span className="footer-con-qrTxt">一起加入我们</span>
                </div>

                <div className="footer-con-qrImg marL42">
                    <img src={qrJoinImg} alt="" className="footer-con-qrJoin" />
                    <span className="footer-con-qrTxt">微信扫码关注我们</span>
                </div>
            </div>
            <div className="footer-con-line" />
            <div className="footer-con-bottom">Copyright ©2020 UI严选</div>
        </div>
    );
};
