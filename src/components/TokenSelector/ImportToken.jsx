import React from 'react';
import './index.scss';

import { Modal } from 'antd';
import Button from 'components/Button';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import DefaultLogo from '../../assets/img/icon_default_coin_logo.svg';

const ImportToken = ({ isOpen, onClose, token, onImport }) => {
    const [copied, setIsCopied] = React.useState(false);

    const copy = () => {
        setIsCopied(true);

        setTimeout(() => {
            setIsCopied(false);
        }, 3000);
    };
    return (
        <Modal
            title=""
            footer={null}
            open={isOpen}
            width={576}
            onCancel={onClose}
            className={'overlay_container common_modal import_token_modal'}
            zIndex={1001}
        >
            <div className="m_t_14">
                <div className="f_r_l">
                    <span className="i_arrow_left i_icon_24 i_icon_a m_r_8" />
                    <span className="h3">Import token</span>
                </div>
                <div className="f_c_l_c m_t_50">
                    <div
                        className={'coin_icon_84'}
                        style={{ backgroundImage: `url(${token?.logoURI || DefaultLogo})` }}
                    ></div>
                    <div className="f_20 b black-bold m_t_15">{token?.symbol}</div>
                    <div className="f_14 cg f_ms_r m_t_4">{token?.localName}</div>
                </div>
                <div className="r_20 bg_secondary asset_address_block f_c_c_c m_t_24">
                    <div className="f_14 cg text_center">Asset address</div>
                    <div className="f_16 f_ms_r text_center m_t_8 text_ellipsis_tail w_200">{token?.address}</div>
                    <CopyToClipboard text={token?.address || ''} onCopy={copy}>
                        <div className="f_r_l m_t_14 cp">
                            <span className="i_copy i_icon_20 i_icon_a m_r_8" />
                            <span className="f_14 b cb">{copied ? 'Copied' : 'Copy'}</span>
                        </div>
                    </CopyToClipboard>
                </div>
                <div className="f_14 cg f_ms_r text_center m_t_24 c_p_8">
                    {`  This token doesn't appear on the active token list(s). Make sure this
          is the token that you want to use.`}
                </div>
                <Button className="m_t_142 w_100" onClick={onImport}>
                    Import
                </Button>
            </div>
        </Modal>
    );
};

export default ImportToken;
