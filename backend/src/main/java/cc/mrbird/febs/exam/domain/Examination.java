package cc.mrbird.febs.exam.domain;

import java.time.LocalDateTime;
import java.io.Serializable;
import java.util.Date;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.wuwenze.poi.annotation.Excel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * 医院试题模块
 *
 * @author pengpeng
 */
@Data
@TableName("examination")
public class Examination implements Serializable {

    private static final long serialVersionUID = 1L;
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    /**
     * 试题 模块
     */
    @NotBlank(message = "{required}")
    @Size(max = 20, message = "{noMoreThan}")
    private String examName;

    /**
     * 父类id
     */
    private Integer parentId;

    /**
     * 启用状态 0-启用 1-停用
     */
    private Integer status;

    /**
     * 是否删除0-否 1-是
     */
    private Integer isDelete;

    /**
     * 新增时间
     */
    private Date insertTime;

    /**
     * 更新时间
     */
    private Date updateTime;

    /**
     * 操作员编码
     */
    private String operationUser;
    /**
     * 操作员名称
     */
    private String operationName;

    /**
     * 备注
     */
    private String remark;
    /**
     *分类顺序
     */
    private Integer orderNum;


}
